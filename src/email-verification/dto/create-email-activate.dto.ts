import { IsNotEmpty, IsInt, IsUUID, Length } from "class-validator";

export class CreateEmailActivateDto {

    @IsInt()
    @IsNotEmpty()
    readonly code: number;

    @IsUUID()
    @IsNotEmpty()
    // @Length(6, 6)
    readonly user: string;
}
