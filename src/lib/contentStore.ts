import fs from 'fs';
import path from 'path';
import { SiteContent, VehicleItem, LeadItem } from './types';
import dbConnect from './dbConnect';
import SiteContentModel from './models/SiteContent';
import Vehicle from './models/Vehicle';
import Lead from './models/Lead';

const dataDir = path.join(process.cwd(), 'data');

// --- Helper Local Fallbacks ---
function readLocalJson<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[Local Store] Error reading ${filename}:`, err);
    return fallback;
  }
}

function writeLocalJson<T>(filename: string, data: T): void {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[Local Store] Error writing ${filename}:`, err);
  }
}

function sanitizeImages<T>(obj: T): T {
  if (!obj) return obj;
  const str = JSON.stringify(obj)
    .replace(/photo-1586191582156-559f71c4c34a/g, 'photo-1601584115197-04ecc0da31d7')
    .replace(/photo-1586191582056-9d582f347101/g, 'photo-1601584115197-04ecc0da31d7');
  return JSON.parse(str);
}

// --- SITE CONTENT ---
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const conn = await dbConnect();
    if (conn) {
      const doc = await SiteContentModel.findOne({ key: 'main' }).lean();
      if (doc) {
        const { _id, __v, key, ...rest } = doc as any;
        return sanitizeImages(rest as SiteContent);
      }

      // If DB is connected but empty, seed from local JSON
      const localData = readLocalJson<SiteContent>('site-content.json', {} as SiteContent);
      if (localData && Object.keys(localData).length > 0) {
        const sanitized = sanitizeImages(localData);
        await SiteContentModel.findOneAndUpdate(
          { key: 'main' },
          { $set: { ...sanitized, key: 'main' } },
          { upsert: true, new: true }
        );
        return sanitized;
      }
    }
  } catch (err) {
    console.error('[MongoDB Store] getSiteContent error, falling back to local:', err);
  }

  return sanitizeImages(readLocalJson<SiteContent>('site-content.json', {} as SiteContent));
}

export async function saveSiteContent(content: Partial<SiteContent>): Promise<SiteContent> {
  // Sync to local backup
  const existingLocal = readLocalJson<SiteContent>('site-content.json', {} as SiteContent);
  const merged = { ...existingLocal, ...content };
  writeLocalJson('site-content.json', merged);

  try {
    const conn = await dbConnect();
    if (conn) {
      const updated = await SiteContentModel.findOneAndUpdate(
        { key: 'main' },
        { $set: { ...merged, key: 'main' } },
        { new: true, upsert: true, lean: true }
      );
      if (updated) {
        const { _id, __v, key, ...rest } = updated as any;
        return rest as SiteContent;
      }
    }
  } catch (err) {
    console.error('[MongoDB Store] saveSiteContent error:', err);
  }

  return merged;
}

// --- VEHICLE CATALOG ---
export async function getVehicleCatalog(): Promise<VehicleItem[]> {
  try {
    const conn = await dbConnect();
    if (conn) {
      const vehicles = await Vehicle.find().sort({ createdAt: 1 }).lean();
      if (vehicles && vehicles.length > 0) {
        const mapped = vehicles.map((v: any) => {
          const { _id, __v, ...rest } = v;
          return rest as VehicleItem;
        });
        return sanitizeImages(mapped);
      }

      // If DB is empty, auto-seed from local vehicle-catalog.json
      const localCatalog = readLocalJson<VehicleItem[]>('vehicle-catalog.json', []);
      if (localCatalog.length > 0) {
        const sanitized = sanitizeImages(localCatalog);
        await Vehicle.insertMany(sanitized, { ordered: false }).catch(() => {});
        return sanitized;
      }
    }
  } catch (err) {
    console.error('[MongoDB Store] getVehicleCatalog error, falling back to local:', err);
  }

  return sanitizeImages(readLocalJson<VehicleItem[]>('vehicle-catalog.json', []));
}

export async function saveVehicleCatalog(catalog: VehicleItem[]): Promise<VehicleItem[]> {
  // Sync to local backup
  writeLocalJson('vehicle-catalog.json', catalog);

  try {
    const conn = await dbConnect();
    if (conn) {
      // Bulk upsert all vehicles
      const bulkOps = catalog.map((item) => ({
        updateOne: {
          filter: { id: item.id },
          update: { $set: item },
          upsert: true,
        },
      }));
      if (bulkOps.length > 0) {
        await Vehicle.bulkWrite(bulkOps);
      }
      return catalog;
    }
  } catch (err) {
    console.error('[MongoDB Store] saveVehicleCatalog error:', err);
  }

  return catalog;
}

export async function saveSingleVehicle(vehicle: VehicleItem): Promise<VehicleItem> {
  const catalog = await getVehicleCatalog();
  const index = catalog.findIndex((v) => v.id === vehicle.id);
  if (index >= 0) {
    catalog[index] = vehicle;
  } else {
    catalog.push(vehicle);
  }
  await saveVehicleCatalog(catalog);
  return vehicle;
}

export async function deleteVehicle(id: string): Promise<boolean> {
  const catalog = await getVehicleCatalog();
  const filtered = catalog.filter((v) => v.id !== id);
  await saveVehicleCatalog(filtered);

  try {
    const conn = await dbConnect();
    if (conn) {
      await Vehicle.deleteOne({ id });
    }
  } catch (err) {
    console.error('[MongoDB Store] deleteVehicle error:', err);
  }

  return true;
}

// --- LEADS ---
export async function getLeads(): Promise<LeadItem[]> {
  try {
    const conn = await dbConnect();
    if (conn) {
      const leads = await Lead.find().sort({ createdAt: -1 }).lean();
      if (leads && leads.length > 0) {
        return leads.map((l: any) => {
          const { _id, __v, ...rest } = l;
          return rest as LeadItem;
        });
      }

      // If DB empty, seed local leads
      const localLeads = readLocalJson<LeadItem[]>('leads.json', []);
      if (localLeads.length > 0) {
        await Lead.insertMany(localLeads, { ordered: false }).catch(() => {});
        return localLeads;
      }
    }
  } catch (err) {
    console.error('[MongoDB Store] getLeads error, falling back to local:', err);
  }

  return readLocalJson<LeadItem[]>('leads.json', []);
}

export async function saveLead(lead: LeadItem): Promise<LeadItem> {
  // Sync to local backup
  const localLeads = readLocalJson<LeadItem[]>('leads.json', []);
  const updatedLocal = [lead, ...localLeads.filter((l) => l.id !== lead.id)];
  writeLocalJson('leads.json', updatedLocal);

  try {
    const conn = await dbConnect();
    if (conn) {
      await Lead.findOneAndUpdate({ id: lead.id }, { $set: lead }, { upsert: true, new: true });
      return lead;
    }
  } catch (err) {
    console.error('[MongoDB Store] saveLead error:', err);
  }

  return lead;
}

export async function updateLeadStatus(id: string, status: LeadItem['status']): Promise<LeadItem | null> {
  // Sync to local backup
  const localLeads = readLocalJson<LeadItem[]>('leads.json', []);
  const index = localLeads.findIndex((l) => l.id === id);
  if (index !== -1) {
    localLeads[index].status = status;
    writeLocalJson('leads.json', localLeads);
  }

  try {
    const conn = await dbConnect();
    if (conn) {
      const updated = await Lead.findOneAndUpdate(
        { id },
        { $set: { status } },
        { new: true, lean: true }
      );
      if (updated) {
        const { _id, __v, ...rest } = updated as any;
        return rest as LeadItem;
      }
    }
  } catch (err) {
    console.error('[MongoDB Store] updateLeadStatus error:', err);
  }

  return index !== -1 ? localLeads[index] : null;
}
