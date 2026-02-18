import { Product } from '@prisma/client'
import { ProductDialog } from './product-dialog'

interface EditProductDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
  return <ProductDialog product={product} open={open} onOpenChange={onOpenChange} />
}
