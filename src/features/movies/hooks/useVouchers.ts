import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { Voucher, VoucherApiResponse } from '../types/voucher.types'

const API_BASE_URL = 'https://api.cinestech.me/api/v1'

// Hook để lấy danh sách voucher public
export const usePublicVouchers = () => {
    return useQuery<VoucherApiResponse>({
        queryKey: ['publicVouchers'],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/voucher/public`)
            if (!response.ok) {
                throw new Error('Failed to fetch vouchers')
            }
            return response.json()
        },
        staleTime: 5 * 60 * 1000 // 5 minutes
    })
}

// Hook để tìm kiếm voucher private bằng code
export const useVoucherSearch = () => {
    const [isSearching, setIsSearching] = useState(false)
    const [searchResult, setSearchResult] = useState<Voucher | null>(null)
    const [searchError, setSearchError] = useState<string | null>(null)

    const searchVoucher = async (code: string): Promise<void> => {
        if (!code.trim()) {
            setSearchResult(null)
            setSearchError(null)
            return
        }

        setIsSearching(true)
        setSearchError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/voucher/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: code.trim().toUpperCase() })
            })

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Voucher not found')
                }
                throw new Error('Failed to check voucher')
            }

            const data = await response.json()

            if (data.success && data.data) {
                setSearchResult(data.data)
            } else {
                setSearchResult(null)
                setSearchError('Voucher not found')
            }
        } catch (error) {
            setSearchResult(null)
            setSearchError(error instanceof Error ? error.message : 'Failed to check voucher')
        } finally {
            setIsSearching(false)
        }
    }

    const clearSearch = () => {
        setSearchResult(null)
        setSearchError(null)
    }

    return {
        searchVoucher,
        clearSearch,
        isSearching,
        searchResult,
        searchError
    }
}
