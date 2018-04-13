import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class IndexController {
    constructor() {

    }

    @Get()
    root(@Res() res) {
        res.render('index', { message: 'Hello world!' });
    }
}
