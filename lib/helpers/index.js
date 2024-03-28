const isPathRelative = (path) => {
  return path === '.' || path.startsWith('./') || path.startsWith('../')
}

const getFileSegments = (path) => {
  const fromPath = path?.split('src')[1]
  return (fromPath?.split((/\\|\//)) || []).filter(Boolean) // regex for split path (win/unix)
}

module.exports = {
  isPathRelative,
  getFileSegments
}
