export {}
export class BadMessageService {
  messageRepo: MessagesRepository

  constructor() {
    this.messageRepo = new MessagesRepository
  }
}

export {}
export class BetterMessageService {
  messageRepo: MessagesRepository

  constructor(repo: MessagesRepository) {
    this.messageRepo = repo
  }
}

interface Repository {
  findOne(id: string)
  findAll()
  create(content: string)
}

export {}
export class GoodMessageService {
  messageRepo: Repository

  constructor(repo: Repository) {
    this.messageRepo = repo
  }
}