<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EventController;

Route::get('/health', fn() => ['status' => 'ok']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


//AUTH
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});
Route::middleware('auth:sanctum')->group(function(){
    Route::post('auth/logout', [AuthController::class, 'logout']);
});


//EVENTS
Route::get('/events', [EventController::class, 'index']); 
Route::get('/events/{id}', [EventController::class, 'Show'])->whereUuid('id');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update'])->whereUuid('id');
    Route::delete('/events/{id}', [EventController::class, 'destroy'])->whereUuid('id');
    Route::get('/events/my', [EventController::class, 'myEvents']);
    Route::post('/events/{id}/attend', [EventController::class, 'attend'])->whereUuid('id');
    Route::delete('/events/{id}/attend', [EventController::class, 'cancelAttendance'])->whereUuid('id');
    Route::get('/events/attending', [EventController::class, 'attending']);
});


