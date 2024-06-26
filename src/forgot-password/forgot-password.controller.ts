import { Body, Controller, HttpStatus, Post, UsePipes, ValidationPipe, HttpCode, NotFoundException, BadGatewayException, BadRequestException } from '@nestjs/common';
import { CheckEmailDto } from './dto/check-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../users/users.service';
import { ForgotPasswordService } from './forgot-password.service';
import { EmailLowerCasePipe } from 'src/pipes/email-lower-case.pipe';
import { HashPasswordPipe } from 'src/pipes/hash-password.pipe';
import { EXPIRE_CODE_TIME, REGISTER_CODE } from 'src/utilities/common';
import { emailVerification } from 'src/utilities/email/emailVerification';
// import { HttpExceptionFilter } from './../../exception/http-exception.filter';

@Controller('forgotPassword')
// @UseFilters(HttpExceptionFilter)
export class ForgotPasswordController {
    constructor(
        private readonly forgotPasswordService: ForgotPasswordService,
        private readonly usersService: UsersService) { }
    // #=======================================================================================#
    // #                          send User email code to rest password                        #
    // #=======================================================================================#
    @Post('checkEmail')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async sendEmailCodeToRestPassword(@Body(EmailLowerCasePipe) emailData: CheckEmailDto) {
        let data: any;
        data = await this.usersService.getUserByEmail(emailData.email)
        if (!data) throw new NotFoundException(`Not user with this email = ${emailData.email}`)

        const registerCode = REGISTER_CODE;
        data = await this.forgotPasswordService.sendEmailCodeToRestPassword(registerCode, EXPIRE_CODE_TIME, data._id)

        if (data) emailVerification({ email: emailData.email, name: data.name }, registerCode, true);
        else throw new BadGatewayException(`can't send email code to this email = ${emailData.email}`)

        return { message: `The code has been sent to your email = ${emailData.email}` }
    }

    // #=======================================================================================#
    // #                                  reset User password                                  #
    // #=======================================================================================#
    @Post('resetPassword')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async resetUserPassword(@Body(HashPasswordPipe) resetData: ResetPasswordDto) {
        let data: any;
        data = await this.usersService.getUserByEmail(resetData.email)
        if (!data)  throw new NotFoundException()
        const userID = data._id;
        if (!data) throw new NotFoundException(`Not user with this email = ${resetData.email}`)

        data = await this.forgotPasswordService.checkCode(resetData.code, data._id)
        if (!data) {
            throw new BadRequestException(`No code send to user with this email = ${resetData.email}`)
        } else if (resetData.code != data.code) {
            throw new BadRequestException('invalid code');
        } else if (new Date() >= data.expire_at) {
            // If the code exceeds a certain time and it has not been used in this application for 24 hours
            throw new BadRequestException('This code has expired');
        }

        data = await this.usersService.resetUserPassword(userID, resetData.password)
        if (data.affected === 0) throw new BadRequestException('an error occurred while changing the password, please try again');

        return { message: 'Password has been successfully restored' }
    }
}
