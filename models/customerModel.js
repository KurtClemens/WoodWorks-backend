class Customer {
  constructor(
    id,
    email,
    city,
    postalCode,
    street,
    number,
    lastName,
    firstName,
    phoneNumber
  ) {
    this.id = id;
    this.email = email;
    this.city = city;
    this.postalCode = postalCode;
    this.street = street;
    this.number = number;
    this.phoneNumber = phoneNumber;
    this.lastName = lastName;
    this.firstName = firstName;
  }
}

module.exports = Customer;
