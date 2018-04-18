import { Controller, Get, Res, Post } from '@nestjs/common';

@Controller()
export class IndexController {
    constructor() {

    }

    @Get()
    root(@Res() res) {
        res.render('index', { message: 'Hello world!' });
    }

    @Get('/rule')
    postRule(@Res() res) {
        res.render('rule');
    }

    @Post('rule')
    addRule(@Res() res) {
        res.render('rule');
    }
}
