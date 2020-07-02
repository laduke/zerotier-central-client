module.exports = function Member (apiMember) {
  const {
    nodeId,
    networkId,
    name,
    description,
    hidden,
    config: { ipAssignments = {} } = {}
  } = apiMember

  return {
    nodeId,
    networkId,
    name,
    description,
    hidden,
    config: { ipAssignments }
  }
}
