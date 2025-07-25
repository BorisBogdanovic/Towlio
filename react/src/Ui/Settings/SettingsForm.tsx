import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiEye, HiEyeSlash, HiLockClosed } from "react-icons/hi2";
import { RootState } from "../../App/store";
import { useEditUser } from "../../hooks/useEditUser";
import { useUpdatePassword } from "../../hooks/useEditPassword";
import Button from "../Button";
import ChangeImageButton from "../ChangeImageButton";
import Input from "../Input";
import RegisterDropdown from "../RegisterDropdown";
import Modal from "../Modal";
import Loader from "../Loader";
import PhoneHelerUi from "../PhoneHelperUi";

function SettingsForm() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [showCurrentPassword, setShowCurrentPassword] =
        useState<boolean>(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] =
        useState<boolean>(false);
    const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        user?.profile_image || null
    );

    //////////////////////////////////////////////////////////REACT QUERY
    const { mutate, isPending } = useEditUser();
    const { mutate: editPassword, isPending: isChangingPassword } =
        useUpdatePassword();

    //////////////////////////////////////////////////////////REACT FROM HOOK
    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            name: user?.name || "",
            last_name: user?.last_name || "",
            phone: user?.phone || "",
            email: user?.email || "",
            city_id: user?.city_id ? Number(user.city_id) : null,
        },
    });

    //////////////////////////////////////////////////// CHECK IF THE FORM FIELDS AND PROFILE IMAGE REMAIN UNCHANGE
    const watchedName = watch("name");
    const watchedLastName = watch("last_name");
    const watchedPhone = watch("phone");
    const watchedCityId = watch("city_id");

    const isFormUnchanged =
        watchedName === user?.name &&
        watchedLastName === user?.last_name &&
        watchedPhone === user?.phone &&
        watchedCityId === (user?.city_id ? Number(user.city_id) : null) &&
        !newProfileImage;

    /////////////////////////////////////////////////////////////////////////////////////////
    const selectedCity = watch("city_id");
    //////////////////////////////////////////////////////////////////////////////SUBMIT FORM
    const onSubmit = handleSubmit((formValues) => {
        const formData = new FormData();
        formData.append("name", formValues.name);
        formData.append("last_name", formValues.last_name);
        formData.append("phone", formValues.phone);
        formData.append("city_id", String(formValues.city_id));
        formData.append("_method", "PATCH");
        if (newProfileImage) {
            formData.append("profile_image", newProfileImage);
        }
        mutate(formData, {
            onSuccess: () => {
                setNewProfileImage(null);
                toast.success("Profile updated successfully!");
            },
            onError: (error) => {
                toast.error("Failed to update profile. Please try again.");
                console.error(error);
            },
        });
    });
    /////////////////////////////////////////////////////////////////DISPLAY SELECTED IMAGE
    const handleImageSelect = (file: File) => {
        setNewProfileImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };
    ////////////////////////////////////////////////////////////////EDITING PASSWORD
    const handlePasswordChange = () => {
        if (!newPassword || !confirmPassword) {
            return;
        }

        if (newPassword !== confirmPassword) {
            return;
        }
        editPassword(
            {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword,
            },
            {
                onSuccess: () => {
                    toast.success("Password changed successfully!");
                    setIsPasswordModalOpen(false);
                    setNewPassword("");
                    setConfirmPassword("");
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to change password.");
                },
            }
        );
    };
    /////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <form className="flex flex-col w-2xl gap-4 m-4" onSubmit={onSubmit}>
                {/* //////////////////////////////////////////////////////////////IMAGE */}
                <div className="flex justify-between">
                    <span className="text-sm text-textGray leading-5">
                        Profile Image
                    </span>
                    <div className="flex justify-between items-center gap-2 w-sm">
                        <div className="w-16 h-16 shrink-0 rounded-full border-2 border-[#ECECEC] overflow-hidden">
                            <img
                                src={previewUrl ?? ""}
                                alt="profile"
                                className="w-full h-full object-cover aspect-square"
                            />
                        </div>
                        <div>
                            <ChangeImageButton
                                onFileSelect={handleImageSelect}
                            />
                        </div>
                    </div>
                </div>

                {/* //////////////////////////////////////////////////////////////CITY */}
                <div className="flex justify-between">
                    <span className="text-sm text-textGray leading-5">
                        City
                    </span>
                    <div className="w-sm">
                        <RegisterDropdown
                            selectedValue={selectedCity}
                            onSelect={(id) => setValue("city_id", id as number)}
                        />
                    </div>
                </div>
                {/* //////////////////////////////////////////////////////////////NAME */}
                <div className="flex justify-between">
                    <span className="text-sm text-textGray leading-5">
                        Name
                    </span>
                    <div>
                        <Input className="w-sm" {...register("name")} />
                    </div>
                </div>
                {/* //////////////////////////////////////////////////////////////LAST NAME */}
                <div className="flex justify-between">
                    <span className="text-sm text-textGray leading-5">
                        Last Name
                    </span>
                    <div>
                        <Input className="w-sm" {...register("last_name")} />
                    </div>
                </div>
                {/* //////////////////////////////////////////////////////////////PHONE */}

                <div className="flex justify-between">
                    <span className="text-sm text-textGray leading-5">
                        Phone
                    </span>
                    <div>
                        <Input
                            icon={<PhoneHelerUi />}
                            className="w-sm"
                            {...register("phone")}
                        />
                    </div>
                </div>
                {/* //////////////////////////////////////////////////////////////EMAIl */}
                <div className="flex justify-between">
                    <span className="text-sm text-textGray leading-5">
                        Email
                    </span>
                    <div>
                        <Input
                            className="w-sm"
                            {...register("email")}
                            inputClassName="bg-secondaryHover text-textLightGray border-iconColor focus:outline-none focus:ring-0 focus:border-iconColor"
                            readOnly
                        />
                    </div>
                </div>
                {/* //////////////////////////////////////////////////////////////PASSWORD */}
                <div className="flex justify-between">
                    <span className="text-sm text-textGray leading-5">
                        Password
                    </span>
                    <div className="flex items-center gap-2 w-sm">
                        <Input
                            value={"****************"}
                            readOnly
                            inputClassName="text-textLightGray border-disabledBorderGray focus:outline-none focus:ring-0 focus:border-disabledBorderGray"
                        />
                        <div>
                            <Button
                                type="main"
                                onClick={() => {
                                    setIsPasswordModalOpen(true);
                                }}
                            >
                                Change
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-[150px]">
                    <Button
                        type="main"
                        htmlType="submit"
                        disabled={isPending || isFormUnchanged}
                    >
                        {isPending ? (
                            <div className="flex items-center gap-2">
                                <Loader wClass="w-4" hClass="h-4" />
                                <span> Saving...</span>
                            </div>
                        ) : (
                            "Save changes"
                        )}
                    </Button>
                </div>
            </form>
            {/* //////////////////////////////////////////////////////////////MODAL*/}
            <Modal
                isOpen={isPasswordModalOpen}
                title="Change Password"
                message="Change Password"
                confirmText={
                    isChangingPassword ? (
                        <div className="flex items-center gap-2">
                            <Loader wClass="w-4" hClass="h-4" />
                            <span> ...changing </span>
                        </div>
                    ) : (
                        "Change Password"
                    )
                }
                cancelText="Cancel"
                onConfirm={handlePasswordChange}
                onCancel={() => {
                    setIsPasswordModalOpen(false);
                    setConfirmPassword("");
                    setNewPassword("");
                    setCurrentPassword("");
                }}
                type="main"
            >
                <Input
                    placeholder="Current Password"
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    icon={<HiLockClosed color="#667085" size={24} />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() =>
                                setShowCurrentPassword((prev) => !prev)
                            }
                            className="focus:outline-none"
                        >
                            {showCurrentPassword ? (
                                <HiEyeSlash color="#667085" size={24} />
                            ) : (
                                <HiEye color="#667085" size={24} />
                            )}
                        </button>
                    }
                />
                <Input
                    placeholder="New Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    icon={<HiLockClosed color="#667085" size={24} />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="focus:outline-none"
                        >
                            {showPassword ? (
                                <HiEyeSlash color="#667085" size={24} />
                            ) : (
                                <HiEye color="#667085" size={24} />
                            )}
                        </button>
                    }
                />

                <Input
                    placeholder="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<HiLockClosed color="#667085" size={24} />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                            }
                            className="focus:outline-none"
                        >
                            {showConfirmPassword ? (
                                <HiEyeSlash color="#667085" size={24} />
                            ) : (
                                <HiEye color="#667085" size={24} />
                            )}
                        </button>
                    }
                />
            </Modal>
        </>
    );
}

export default SettingsForm;
