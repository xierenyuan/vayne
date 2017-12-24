class Commander {
  constructor(name = 'serve', options = {}) {
    this.cName = name
    this.cwd = process.cwd()
    this.env = name === 'build' ? 'production' : 'development'
    this.open = options.open || false
    this.config = options.config
    this.report = options.report || false
    this.host = options.host
    this.port = options.port
  }

  name() {
    return this.cName
  }
}

module.exports = Commander
