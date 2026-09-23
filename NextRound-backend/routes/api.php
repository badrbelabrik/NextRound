<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\RankingController;
use App\Http\Controllers\Api\RegistrationController;
use App\Http\Controllers\Api\ResultController;
use App\Http\Controllers\Api\TournamentController;
use App\Http\Controllers\Api\TournamentMatchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{game}', [GameController::class, 'show']);
Route::get('/tournaments', [TournamentController::class, 'index']);
Route::get('/tournaments/{tournament}', [TournamentController::class, 'show']);
Route::get('/games/{game}/rankings', [RankingController::class, 'index']);
Route::get('/games/{game}/rankings/{user}', [RankingController::class, 'show']);
Route::get('/top-players', [RankingController::class, 'topPlayers']);
Route::get('/matches', [TournamentMatchController::class, 'index']);
Route::get('/results', [ResultController::class, 'index']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/games', [GameController::class, 'store']);
    Route::put('/games/{game}', [GameController::class, 'update']);
    Route::delete('/games/{game}', [GameController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    //GAMES
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    //TOURNAMENTS
    Route::post('/tournaments', [TournamentController::class, 'store']);
    Route::get('/my-tournaments', [TournamentController::class, 'myTournaments']);
    Route::put('/tournaments/{tournament}', [TournamentController::class, 'update']);
    Route::delete('/tournaments/{tournament}', [TournamentController::class, 'destroy']);
    //REGISTRATION
    Route::get('/my-registrations', [RegistrationController::class, 'myRegistrations']);
    Route::get('/tournaments/{tournament}/registrations', [RegistrationController::class, 'index']);
    Route::post('/tournaments/{tournament}/register', [RegistrationController::class, 'store']);
    Route::put('/registrations/{registration}', [RegistrationController::class, 'update']);
    Route::delete('/tournaments/{tournament}/register', [RegistrationController::class, 'destroy']);
    //MATCHES-GENERATION
    Route::post('/tournaments/{tournament}/matches/generate', [TournamentMatchController::class, 'generate']);
    //MATCHES
    Route::get('/my-matches', [TournamentMatchController::class, 'myMatches']);
    Route::get('/matches/{match}', [TournamentMatchController::class, 'show']);
    Route::post('/matches', [TournamentMatchController::class, 'store']);
    Route::put('/matches/{match}', [TournamentMatchController::class, 'update']);
    Route::delete('/matches/{match}', [TournamentMatchController::class, 'destroy']);
    //MATCH-RESULTS
    Route::get('/my-results', [ResultController::class, 'myResults']);
    Route::get('/results/{result}', [ResultController::class, 'show']);
    Route::post('/results', [ResultController::class, 'store']);
    Route::put('/results/{result}', [ResultController::class, 'update']);
    Route::delete('/results/{result}', [ResultController::class, 'destroy']);
    //NOTIFICATIONS
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/{notification}', [NotificationController::class, 'show']);
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);
});
