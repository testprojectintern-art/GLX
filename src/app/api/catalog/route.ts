import { NextRequest, NextResponse } from 'next/server';
import { getVehicleCatalog, saveVehicleCatalog } from '@/lib/contentStore';
import { VehicleItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const catalog = await getVehicleCatalog();
    return NextResponse.json(catalog);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to read catalog' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const catalog = await getVehicleCatalog();

    // If body is an array, overwrite entire catalog
    if (Array.isArray(body)) {
      const saved = await saveVehicleCatalog(body);
      return NextResponse.json({ success: true, catalog: saved });
    }

    // Otherwise, treat as adding a single new vehicle
    const newVehicle: VehicleItem = {
      id: body.id || `veh-${Date.now()}`,
      name: body.name || 'New Vehicle Model',
      slug: body.slug || (body.name || 'new-model').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      tagline: body.tagline || '',
      category: body.category || 'General',
      badge: body.badge || '',
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80',
      gallery: body.gallery || [],
      description: body.description || '',
      specs: body.specs || {
        chassisCompatibility: 'All Models',
        sheetMaterial: '1.5mm GI Sheet',
        floorPlate: '2.5mm Checkered Plate',
        paintFinish: '2K Polyurethane Coating',
        dimensions: 'Custom Built',
        warranty: '5-Year Structural Guarantee',
      },
      standardOptions: body.standardOptions || [],
      basePrice: Number(body.basePrice) || 100000,
      leadTime: body.leadTime || '5 - 7 Days',
    };

    const updated = [...catalog, newVehicle];
    await saveVehicleCatalog(updated);

    return NextResponse.json({ success: true, vehicle: newVehicle, catalog: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save catalog' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const catalog = await getVehicleCatalog();
    const index = catalog.findIndex((v) => v.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    catalog[index] = { ...catalog[index], ...body };
    await saveVehicleCatalog(catalog);

    return NextResponse.json({ success: true, vehicle: catalog[index], catalog });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update vehicle' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
    }

    const catalog = await getVehicleCatalog();
    const filtered = catalog.filter((v) => v.id !== id);
    await saveVehicleCatalog(filtered);

    return NextResponse.json({ success: true, catalog: filtered });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete vehicle' }, { status: 500 });
  }
}
