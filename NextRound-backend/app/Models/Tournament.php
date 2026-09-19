<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tournament extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'game_id',
        'user_id',
        'start_date',
        'end_date',
        'max_players',
        'status',
        'prize',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    // Tournament belongs to one organizer
    public function organizer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Tournament belongs to one game
    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    // Tournament has many registrations
    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    // Tournament has many matches
    public function matches()
    {
        return $this->hasMany(TournamentMatch::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
