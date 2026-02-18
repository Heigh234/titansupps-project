'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ProductDialog } from './product-dialog'

export function CreateProductButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="btn-primary">
        <Plus className="w-5 h-5 mr-2" />
        Add Product
      </Button>
      <ProductDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
