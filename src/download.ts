const download = (url: string) => {
  const link = document.createElement('a')
  link.setAttribute('download', 'timeline.svg')
  link.setAttribute('href', url)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const svgNodeToDataUrl = (svg: Node): string => {
  const doctype =
    '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'

  return `data:image/svg+xml;base64,${btoa(
    unescape(encodeURIComponent(doctype + new XMLSerializer().serializeToString(svg)))
  )}`
}

export default (svg: Node) => download(svgNodeToDataUrl(svg))
