
class UserUpdateDto {

    name?: string;
    surname?: string;
    phone?: string;
    city?: string;
    shopinfo?: ShopInfoUpdateDto;
    image?: string;

}

export class ShopInfoUpdateDto {

    name?: string;
    address?: string;
}

export interface SaveProductDto {
    productId: string;
}

export {
    UserUpdateDto
};