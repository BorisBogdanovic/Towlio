<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EditUserRequest extends FormRequest
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
           'profile_image' => 'sometimes|file|image|mimes:jpeg,png,jpg,gif|max:2048',
           'last_name' => ['sometimes', 'string', 'max:50'], 
           'name' => ['sometimes', 'string', 'max:50'],
           'city_id' => ['sometimes','integer', 'exists:cities,id'],
           'phone' => ['sometimes', 'string', 'regex:/^\+?[0-9\-\s]{6,20}$/'],
          
        ];
    }
}
