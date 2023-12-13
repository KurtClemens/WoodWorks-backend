class Invoice {
    constructor(
      id,
      number,
      content,
      amount,
      signature,
      customer,
    ) {
      this.id = id;
      this.number = number;
      this.content = content;
      this.amount = amount;
      this.signature = signature;
      this.customer = customer;
    }
  }
  
  module.exports = Invoice;
  