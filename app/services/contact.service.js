const { ObjectId } = require("mongodb");

class ContactService {
  constructor(client) {
    this.Contact = client.db().collection("contacts");
  }

  // Tạo object contact
  extractContactData(payload) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite,
    };

    Object.keys(contact).forEach(
      (key) => contact[key] === undefined && delete contact[key]
    );

    return contact;
  }

  // Tạo contact
  async create(payload) {
    const contact = this.extractContactData(payload);

    const result = await this.Contact.findOneAndUpdate(
      contact,
      { $set: { favorite: contact.favorite === true } },
      { returnDocument: "after", upsert: true }
    );

    return result.value;
  }

  // Lấy tất cả contact
  async find(filter) {
    const cursor = await this.Contact.find(filter);
    return await cursor.toArray();
  }

  // Tìm theo name
  async findByName(name) {
    const cursor = await this.Contact.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
    return await cursor.toArray();
  }

  // Tìm theo id
  async findById(id) {
    return await this.Contact.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
  async update(id, payload) {
  const filter = {
    _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  };

  const update = this.extractContactData(payload);

  const result = await this.Contact.findOneAndUpdate(
    filter,
    { $set: update },
    { returnDocument: "after" }
  );

  return result.value;
}
async findFavorite() {
  const cursor = await this.Contact.find({
    favorite: true
  });
  return await cursor.toArray();
}
async deleteAll() {
  const result = await this.Contact.deleteMany({});
  return result.deletedCount;
}
}

module.exports = ContactService;