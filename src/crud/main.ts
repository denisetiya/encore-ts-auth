// import { CreatePaymentRequestRequest } from './../../node_modules/xendit-node/payment_request/apis/PaymentRequest.d';
// import { createData } from './main';
import { api } from "encore.dev/api";
interface Response {
    data: number[]
}

interface addResponse {
    data: number
}

interface editResponse {
    id : number
    data: number
}




const data = [1,2,3]

export const getData = api({
    method: "GET",
    path: "/data",
    expose: true,
    auth: true
}, async () : Promise<Response> => {
    return {
        data
    }
})


export const createData = api<addResponse, Response>({
    method: "POST",
    path: "/data",
    expose: true
}, async (req) => {
    data.push(req.data)
    return {
        data
    }
})


export const editData = api<editResponse, Response>({
    method: "PUT",
    path: "/data/:id",
    expose: true
}, async (req) => {
    data[req.id] = req.data
    return {
        data
    }
})