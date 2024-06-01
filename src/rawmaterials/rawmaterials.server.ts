import { prisma } from "../utils/prisma.server";

type RawMaterialsInventory = {
  rawMaterialType: string;
  quantity: number;
  unit: string | null;
  status: string;
};

//GET ALL RAW MATERIALS
export const getRawMaterials = async (): Promise<RawMaterialsInventory[]> => {
  try {
    return await prisma.rawMaterialInventory.findMany({
      select: {
        id: true,
        rawMaterialType: true,
        quantity: true,
        unit: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("Error fetching raw materials:", error);
    throw error;
  }
};

//GET raw material by ID
export const getRawMaterialById = async (
  id: string
): Promise<RawMaterialsInventory | null> => {
  try {
    return await prisma.rawMaterialInventory.findUnique({
      where: { id },
      select: {
        id: true,
        rawMaterialType: true,
        quantity: true,
        unit: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("Error fetching raw material by ID:", error);
    throw error;
  }
};

//CREATE raw material
export const createRawMaterial = async (
  rawMaterial: RawMaterialsInventory
): Promise<RawMaterialsInventory> => {
  try {
    const existingRawMaterial = await prisma.rawMaterialInventory.findFirst({
      where: { rawMaterialType: rawMaterial.rawMaterialType },
    });

    if (existingRawMaterial) {
      return await prisma.rawMaterialInventory.update({
        where: { id: existingRawMaterial.id },
        data: {
          quantity: rawMaterial.quantity,
          status:
            rawMaterial.quantity === 0
              ? "OUT_OF_STOCK"
              : rawMaterial.quantity > 0
              ? "IN_STOCK"
              : rawMaterial.status,
        },
        select: {
          id: true,
          rawMaterialType: true,
          quantity: true,
          unit: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else {
      return await prisma.rawMaterialInventory.create({
        data: {
          rawMaterialType: rawMaterial.rawMaterialType,
          quantity: rawMaterial.quantity,
          unit: rawMaterial.unit,
          status: "IN_STOCK",
        },
        select: {
          id: true,
          rawMaterialType: true,
          quantity: true,
          unit: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }
  } catch (error) {
    console.error("Error creating or updating raw material:", error);
    throw error;
  }
};

//UPDATE raw material
export const updateRawMaterial = async (
  id: string,
  rawMaterial: RawMaterialsInventory
): Promise<RawMaterialsInventory> => {
  try {
    return await prisma.rawMaterialInventory.update({
      where: { id },
      data: {
        rawMaterialType: rawMaterial.rawMaterialType,
        quantity: rawMaterial.quantity,
        unit: rawMaterial.unit,
        status:
          rawMaterial.quantity === 0
            ? "OUT_OF_STOCK"
            : rawMaterial.quantity > 0
            ? "IN_STOCK"
            : rawMaterial.status,
      },
      select: {
        id: true,
        rawMaterialType: true,
        quantity: true,
        unit: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("Error updating raw material:", error);
    throw error;
  }
};

//DELETE raw material
export const deleteRawMaterial = async (
  id: string
): Promise<RawMaterialsInventory> => {
  try {
    return await prisma.rawMaterialInventory.delete({
      where: { id },
      select: {
        id: true,
        rawMaterialType: true,
        quantity: true,
        unit: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("Error deleting raw material:", error);
    throw error;
  }
};
