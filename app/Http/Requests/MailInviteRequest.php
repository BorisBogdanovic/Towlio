<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MailInviteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email'=>['required','email','unique:users,email'],
            'token'=>['string'],
            'last_name'=>['string','required'],
            'name'=>['string','required'],
             'phone' => 'required|string|regex:/^[0-9\+\-\s]{6,20}$/',
            ];
    }
}
