class Invoice {
  constructor(id, number, content, amount, signed, signature, payed) {
    this.id = id;
    this.number = number;
    this.content = content;
    this.amount = amount;
    this.signed = signed;
    this.signature = signature;
    this.payed = payed;
  }
}

module.exports = Invoice;
