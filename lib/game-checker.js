import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

class CodaRequest {
    constructor() {
        this.endpoint = 'https://order-sg.codashop.com/initPayment.action';
        this.headers = {
            "Host": "order-sg.codashop.com",
            "Accept-Language": "id-ID",
            "Origin": "https://www.codashop.com",
            "Referer": "https://www.codashop.com/",
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
        };
    }

    async post(payload) {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: this.headers,
                body: new URLSearchParams(payload)
            });
            const data = await response.json();

            if (response.status === 200 && data.errorCode === '') {
                return { success: true, data };
            } else {
                throw new Error(data.errorMsg || 'Failed to validate ID.');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const coda = new CodaRequest();

async function eight_ball_pool(userId) {
    const payload = { 'voucherPricePoint.id': 272564, 'user.userId': userId, 'voucherTypeName': 'EIGHT_BALL_POOL', 'shopLang': 'id_ID' };
    const res = await coda.post(payload);
    return { nickname: res.data.confirmationFields?.username };
}

async function arena_of_valor(userId) {
    const payload = { 'voucherPricePoint.id': '270294', 'user.userId': userId, 'voucherTypeName': 'AOV', 'shopLang': 'id_ID' };
    const res = await coda.post(payload);
    return { nickname: res.data.confirmationFields?.roles?.[0]?.role, server: res.data.confirmationFields?.roles?.[0]?.server };
}

async function auto_chess(userId) {
    const payload = { 'voucherPricePoint.id': '203879', 'user.userId': userId, 'voucherTypeName': 'AUTO_CHESS', 'shopLang': 'id_ID' };
    const res = await coda.post(payload);
    return { nickname: res.data.confirmationFields?.username };
}

async function azur_lane(userId, zoneId) {
    const zoneMap = { 'Avrora': '1', 'Lexington': '2', 'Sandy': '3', 'Washington': '4', 'Amagi': '5', 'Little Enterprise': '6' };
    if (!zoneMap[zoneId]) throw new Error('Invalid Zone ID');
    const payload = { 'voucherPricePoint.id': '99665', 'user.userId': userId, 'user.zoneId': zoneMap[zoneId], 'voucherTypeName': 'AZUR_LANE', 'shopLang': 'id_ID' };
    const res = await coda.post(payload);
    return { nickname: res.data.confirmationFields?.username, server: zoneId };
}

async function call_of_duty(userId) {
    const payload = { 'voucherPricePoint.id': '270251', 'user.userId': userId, 'voucherTypeName': 'CALL_OF_DUTY', 'shopLang': 'id_ID' };
    const res = await coda.post(payload);
    return { nickname: res.data.confirmationFields?.roles?.[0]?.role };
}

async function dragon_city(userId) {
    const payload = { 'voucherPricePoint.id': '254206', 'user.userId': userId, 'voucherTypeName': 'DRAGON_CITY', 'shopLang': 'id_ID' };
    const res = await coda.post(payload);
    return { nickname: res.data.confirmationFields?.username };
}

async function free_fire(userId) {
    const payload = { 'voucherPricePoint.id': '270288', 'user.userId': userId, 'voucherTypeName': 'FREEFIRE', 'shopLang': 'id_ID' };
    const res = await coda.post(payload);
    return { nickname: res.data.confirmationFields?.roles?.[0]?.role };
}

async function hago(userId) {
    const payload = { 'voucherPricePoint.id': '272113', 'user.userId': userId, 'voucherTypeName': 'HAGO', 'shopLang': 'id_ID' };
    const res = await coda.post(payload);
    return { nickname: res.data.confirmationFields?.username };
}

async function mobile_legends(userId, zoneId) {
    const payload = { 'voucherPricePoint.id': '5199', 'user.userId': userId, 'user.zoneId': zoneId, 'voucherTypeName': 'MOBILE_LEGENDS', 'shopLang': 'id_ID' };
    const res = await coda.post(payload);
    return { nickname: res.data.confirmationFields?.username };
}

async function point_blank(userId) {
    const payload = { 'voucherPricePoint.id': '344845', 'user.userId': userId, 'user.zoneId': '0', 'voucherTypeName': 'POINT_BLANK', 'shopLang': 'id_ID' };
    const res = await coda.post(payload);
    return { nickname: res.data.confirmationFields?.username };
}

export {
    eight_ball_pool, arena_of_valor, auto_chess, azur_lane, call_of_duty,
    dragon_city, free_fire, hago, mobile_legends, point_blank
};
