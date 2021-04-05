export function removeWsHeaders() {
  return (req, res) => {
    res.removeHeader('Server')
  }
}
