export interface SearchRequest {
    keyword?: string;
    value?: string;
    keyword2?: string;
    value2?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    startDate?: string; 
    endDate?: string;
  }