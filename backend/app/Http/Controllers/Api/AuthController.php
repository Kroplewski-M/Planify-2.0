<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(RegisterRequest $request){
        try {
            $data = $request->validated();
            $user = User::create([
                'name' => $data['firstname'] . ' ' . $data['lastname'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
            ]);
            $token = $user->createToken('auth')->plainTextToken;
            return response()->json(['token' => $token], 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function login(LoginRequest $request){
        $credentials = $request->validated();
        if(!Auth::attempt($credentials)){
            return response([
                'errors' => 'Provided email address or password is incorrect',
            ]);
        }
        $user = Auth::user();
        $token = $user->createToken('auth')->plainTextToken;
        return response(['token' => $token]);
    }
    public function logout(Request $request){
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('Ok', 204);
    }
}
