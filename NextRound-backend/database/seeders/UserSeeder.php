<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'John Player',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'role' => 'normal_user',
        ]);

        User::create([
            'name' => 'Ahmed',
            'email' => 'ahmed@example.com',
            'password' => Hash::make('password'),
            'role' => 'normal_user',
        ]);

        User::create([
            'name' => 'Karim',
            'email' => 'karim@example.com',
            'password' => Hash::make('password'),
            'role' => 'normal_user',
        ]);

        User::create([
            'name' => 'Yassine',
            'email' => 'yassine@example.com',
            'password' => Hash::make('password'),
            'role' => 'normal_user',
        ]);

        User::create([
            'name' => 'Sara',
            'email' => 'sara@example.com',
            'password' => Hash::make('password'),
            'role' => 'normal_user',
        ]);

        User::create([
            'name' => 'Adam',
            'email' => 'adam@example.com',
            'password' => Hash::make('password'),
            'role' => 'normal_user',
        ]);

        User::create([
            'name' => 'Samir',
            'email' => 'samir@example.com',
            'password' => Hash::make('password'),
            'role' => 'normal_user',
        ]);

        User::create([
            'name' => 'Omar',
            'email' => 'omar@example.com',
            'password' => Hash::make('password'),
            'role' => 'normal_user',
        ]);

        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
    }
}
