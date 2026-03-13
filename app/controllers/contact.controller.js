const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tạo contact
exports.create = async (req, res, next) => {
  if (!req.body.name) {
    return next(new ApiError(400, "Name can not be empty"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Error creating contact"));
  }
};

// Lấy tất cả contacts
exports.findAll = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Error retrieving contacts"));
  }
};

// Tìm contact theo id
exports.findOne = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }

    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Error retrieving contact"));
  }
};

// Cập nhật contact
exports.update = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }

    return res.send({ message: "Contact updated successfully" });
  } catch (error) {
    return next(new ApiError(500, "Error updating contact"));
  }
};

// Xóa contact
exports.delete = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }

    return res.send({ message: "Contact deleted successfully" });
  } catch (error) {
    return next(new ApiError(500, "Error deleting contact"));
  }
};

// Xóa tất cả contacts
exports.deleteAll = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deletedCount = await contactService.deleteAll();

    return res.send({
      message: `${deletedCount} contacts were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "Error deleting contacts"));
  }
};

// Lấy contact favorite
exports.findAllFavorite = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.findFavorite();
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Error retrieving favorite contacts"));
  }
};