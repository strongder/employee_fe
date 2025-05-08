"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useState } from "react"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage?: number
  onPageChange?: (page: number) => void
}

export function Pagination({ totalItems, itemsPerPage, currentPage = 1, onPageChange }: PaginationProps) {
  const [page, setPage] = useState(currentPage)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage)
      onPageChange?.(newPage)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Hiển thị {Math.min((page - 1) * itemsPerPage + 1, totalItems)} đến {Math.min(page * itemsPerPage, totalItems)}{" "}
        trong số {totalItems} mục
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => handlePageChange(1)} disabled={page === 1}>
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">Trang đầu</span>
        </Button>
        <Button variant="outline" size="icon" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Trang trước</span>
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = page
            if (page <= 3) {
              pageNum = i + 1
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = page - 2 + i
            }

            if (pageNum > 0 && pageNum <= totalPages) {
              return (
                <Button
                  key={i}
                  variant={pageNum === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            }
            return null
          })}
        </div>
        <Button variant="outline" size="icon" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Trang sau</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Trang cuối</span>
        </Button>
      </div>
    </div>
  )
}
