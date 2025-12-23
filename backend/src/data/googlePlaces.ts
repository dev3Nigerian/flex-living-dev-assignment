export const propertyPlaceIds: Record<number, string> = {
  253093: 'ChIJc2nSALkEdkgRkuoJJBfzkUI', // Shoreditch (Google London HQ as placeholder)
  112233: 'ChIJtV5bzSAFdkgRpwLZFPWrJgo', // Canary Wharf placeholder
  556677: 'ChIJNcV0s9QEdkgRd31NxPUnbWQ', // Soho / London
  334455: 'ChIJKZQaXxwbdkgRWLo89tC-_V8', // Camden Market area
  778899: 'ChIJv-AZZAARdkgRQe69wntqSFI', // Notting Hill
};

export const resolvePlaceIdForListing = (listingId?: number | null) => {
  if (listingId && propertyPlaceIds[listingId]) {
    return propertyPlaceIds[listingId];
  }
  return propertyPlaceIds[253093];
};

