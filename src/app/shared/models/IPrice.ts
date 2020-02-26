export interface IPrice {
    id?: string;
    price: number;
    fuel: string;
    from?: {
        seconds: number,
        nanoseconds: number
    },
    to?: {
        seconds: number,
        nanoseconds: number
    },
    published?: boolean;
}