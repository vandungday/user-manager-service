import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        enum: ['admin', 'user'],
        default: 'user'
    })
    role: string;

    @Column({
        name: 'is_active',
        default: true
    })
    isActive: boolean;

    @CreateDateColumn({
        default: new Date(),
        name: 'created_at',
        type: 'timestamp',
    })
    createdAt: Date;

    @UpdateDateColumn({
        default: new Date(),
        name: 'updated_at',
        type: 'timestamp',
    })
    updatedAt: Date;
}
