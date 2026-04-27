import { config } from '@/config/config'
import api from '@/config/api'

interface SendEmail {
  name: string;
  phone: string;
  productUrl: string;
}

export const sendEmail = {
  async postDataCustomer(name: string, phone: string, productUrl: string): Promise<SendEmail> {
    const res = await api.post(config.ROUTES.SEND_EMAIL.SEND, {
      name: name,
      phone: phone,
      productUrl: productUrl
    })
    if (!res) {
      console.error("Gửi email cho nhân viên thất bại.")
    }
    return res.data
  }
}
