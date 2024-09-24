export function paginate(
  totalPages: number,
  currentPage: number,
  // Number of adjacent pages to show on either side of the current page
  siblingCount: number = 1
) {
  const totalNumbers = siblingCount * 2 + 5; // 5: first, last, current, and two dots.
  const totalBlocks = totalNumbers + 2; // Total pages including the "...".

  if (totalPages > totalBlocks) {
    const startPage = Math.max(2, currentPage - siblingCount); // Start from second page
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount); // Stop before last page

    let pages: (number | string)[] = [];

    // Show first page
    pages.push(1);

    // Show dots after the first page if the starting page is greater than 2
    if (startPage > 2) {
      pages.push("...");
    }

    // Show range of pages between startPage and endPage
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Show dots before the last page if the ending page is less than totalPages - 1
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Show the last page
    pages.push(totalPages);

    return pages;
  }

  // If number of pages is less than the block size, show all pages
  return Array.from({ length: totalPages }, (_, idx) => idx + 1);
}
