import moment from 'moment';
import { Column, PrimaryGeneratedColumn, BeforeUpdate } from 'typeorm';

export abstract class Base {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createAt: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    updateAt: string;
    
    @BeforeUpdate()
    updateDate() {
        this.updateAt = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
