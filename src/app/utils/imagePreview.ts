export const url: string = 'https://api.divandione.com'
// export const url: string = 'http://10.10.20.54:5000'

// export const url: string = 'http://localhost:5000'
// export const url: string = 'http://localhost:5000'

export const imageUrl = ({ image }: { image: string }) => {
  if (!image) return "https://placehold.co/400"
  const fixedImage = image.replace(/\\/g, "/")
  return fixedImage.startsWith("http")
    ? fixedImage
    : fixedImage.startsWith("/")
      ? `${url}${fixedImage}`
      : `${url}/${fixedImage}`
}
