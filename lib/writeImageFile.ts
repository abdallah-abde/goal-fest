import fs from "fs/promises";

export async function writeImageFile(
  imageUrl?: File | undefined,
  dir?: string | null
) {
  let imageUrlPath = "";

  if (imageUrl != null && imageUrl.size > 0) {
    imageUrlPath = `/images/${dir}/${crypto.randomUUID()}-${imageUrl.name}`;

    if (imageUrl !== null) {
      await fs.writeFile(
        `public${imageUrlPath}`,
        new Uint8Array(Buffer.from(await imageUrl.arrayBuffer()))
      );
    }
  }

  return imageUrlPath;
}

export async function deleteAndWriteImageFile(
  imageUrl?: File | undefined,
  dir?: string | null,
  currentImageUrl?: string | null
) {
  let imageUrlPath = currentImageUrl;

  if (imageUrl != null && imageUrl.size > 0) {
    if (currentImageUrl) await fs.unlink(`public${currentImageUrl}`);

    imageUrlPath = `/images/${dir}/${crypto.randomUUID()}-${imageUrl.name}`;

    await fs.writeFile(
      `public${imageUrlPath}`,
      new Uint8Array(Buffer.from(await imageUrl.arrayBuffer()))
    );
  }

  return imageUrlPath;
}
