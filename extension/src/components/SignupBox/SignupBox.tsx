import { useContext, useState } from "react";
import {
  SignUpSchema,
  type SignUpBodyTypes,
} from "../../types/schema/data.schema";
import { ZodError } from "zod";
import { Eye, EyeClosed, Info } from "lucide-react";
import { TabContext } from "../../context/TabContext";

const initialFormState: SignUpBodyTypes = {
  email: "",
  password: "",
  name: "",
  apiKey: "",
};

type FormErrors = Partial<Record<keyof SignUpBodyTypes, string>>;

const SignupBox: React.FC = () => {
  const [formData, setFormData] = useState<SignUpBodyTypes>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hide, setHide] = useState<boolean>(true);
  const [info, setInfo] = useState<boolean>(false);

  const context = useContext(TabContext);
  if (!context) return null;

  const { setTab } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    //? Clear error on change for that field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      SignUpSchema.parse(formData);
      setErrors({});
      console.log("Form submitted successfully: ", formData);

      //TODO: Now we need to call our api here

      setTab("main");
    } catch (error: any) {
      if (error instanceof ZodError) {
        const fieldErrors: FormErrors = {};
        error.issues.forEach((err) => {
          if (err.path && err.path[0]) {
            const fieldName = err.path[0] as keyof SignUpBodyTypes;
            fieldErrors[fieldName] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className=" flex flex-col items-center justify-center my-5 gap-2"
    >
      <div className=" w-[80%]">
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="block p-1.5 w-full text-sm text-gray-900 bg-[var(--bg-color)] rounded-lg border border-[var(--dark-color)] outline-none"
          placeholder="Enter Your Email"
        />
        {errors.email && <p className="p-1 text-red-400">{errors.email}</p>}
      </div>
      <div className=" w-[80%]">
        <div className=" flex w-full">
          <input
            type={hide ? "password" : "text"}
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="block p-1.5 w-full text-sm text-gray-900 bg-[var(--bg-color)] rounded-lg border border-[var(--dark-color)] outline-none"
            placeholder="Enter Your Password"
          />
          <button
            type="button"
            className=" ml-1 cursor-pointer"
            onClick={() => setHide((prev) => !prev)}
          >
            {hide ? <Eye size={20} /> : <EyeClosed size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="p-1 text-red-400">{errors.password}</p>
        )}
      </div>
      <div className=" w-[80%]">
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="block p-1.5 w-full text-sm text-gray-900 bg-[var(--bg-color)] rounded-lg border border-[var(--dark-color)] outline-none"
          placeholder="Enter Your First Name"
        />
        {errors.name && <p className="p-1 text-red-400">{errors.name}</p>}
      </div>
      <div className=" w-[80%]">
        <div className=" flex w-full">
          <input
            type="text"
            name="apiKey"
            id="apiKey"
            value={formData.apiKey}
            onChange={handleChange}
            required
            className="block p-1.5 w-full text-sm text-gray-900 bg-[var(--bg-color)] rounded-lg border border-[var(--dark-color)] outline-none"
            placeholder="Enter Your Gemini Api Key"
          />
          <button
            type="button"
            className=" ml-1 cursor-pointer"
            onClick={() => setInfo((prev) => !prev)}
          >
            <Info size={20} />
          </button>
        </div>
        {errors.apiKey && <p className="p-1 text-red-400">{errors.apiKey}</p>}
        {info && (
          <p className="p-1 text-blue-400">
            Your Key Should Be a{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              title="Get Your Gemini Api Key"
              className=" cursor-pointer font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gemini Api Key
            </a>
            . It will be protected with our end to end encryption algorithm{" "}
          </p>
        )}
      </div>

      <div className=" w-[80%] mt-2">
        <button
          type="submit"
          className="inline-flex justify-center w-[70px] p-1.5 text-[var(--bg-color)] rounded-sm text-[14px] cursor-pointer bg-[var(--dark-color)] hover:bg-[#716863]"
        >
          Submit
        </button>
      </div>
      <p className=" w-[80%] mt-5 text-center text-[14px]">
        Already have an account ?{" "}
        <span
          className=" font-bold text-blue-400 cursor-pointer"
          onClick={() => setTab("login")}
        >
          Login
        </span>
      </p>
    </form>
  );
};

export default SignupBox;
