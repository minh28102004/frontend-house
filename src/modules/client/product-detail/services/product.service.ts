import { config } from '@/config/config'
import { ClientProductBasic } from '../models/product.model'
import api from '@/config/api'

export const ClientProductsService = {
  async getBySlug(slug: string): Promise<ClientProductBasic> {
    const res = await api.get(config.ROUTES.PRODUCTS.GET_BY_SLUG(slug))
    if (res.status !== 200) {
      throw new Error('Không lấy được thông tin sản phẩm')
    }
    return res.data
  }
}
