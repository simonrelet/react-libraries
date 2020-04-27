async function doStuff() {
  return Promise.resolve(1)
}

export async function otherStuff() {
  const result = await doStuff()
  return result + 1
}
