const { SuccessMessage, ErrorResponse, ErrorMessage, SuccessResponse, ErrorType } = require("../models/response");

class MedicineOrderController {
    constructor(medicineOrderService) {
        this.medicineOrderService = medicineOrderService
    }

    async createMedicineOrder(req, res) {
        try {
            const { userId } = req
            const payload = {userId, ...req.body}
            const newMedicineOrder = await this.medicineOrderService.createMedicineOrder(payload)
            const response = new SuccessResponse(SuccessMessage.MEDICINE_ORDER_CREATED, newMedicineOrder)
            res.status(201).send(response)
        } catch (err) {
            const errs = [new ErrorResponse(ErrorType.ERROR_MEDICINE_ORDER_CREATION, err.message)]
            res.status(err.status? err.status: 500).send(errs)
        }
    }

    async getMedicineOrderById(req, res) {
        try {
            const { medicineOrderId } = req.params
            const { userId } = req
            const medicineOrder = await this.medicineOrderService.getMedicineOrderById(medicineOrderId, userId)
            const response = new SuccessResponse(SuccessMessage.MEDICINE_ORDER_FETCHED, medicineOrder)
            res.status(200).send(response)
        } catch (err) {
            const errs = [new ErrorResponse(ErrorType.ERROR_MEDICINE_ORDER_FETCH, err.message)]
            res.status(err.status? err.status: 500).send(errs)
        }
    }

    async getMedicineOrders(req, res) {
        try {
            const { userId } = req
            const medicineOrders = await this.medicineOrderService.getMedicineOrders(userId)
            const response = new SuccessResponse(SuccessMessage.MEDICINE_ORDER_FETCHED, medicineOrders)
            res.status(200).send(response)
        } catch (err) {
            const errs = [new ErrorResponse(ErrorType.ERROR_MEDICINE_ORDER_FETCH, err.message)]
            res.status(err.status? err.status: 500).send(errs)
        }
    }
}

module.exports = { MedicineOrderController }