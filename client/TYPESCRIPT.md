## onChange()

```js
const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  // update form state
  setSignUpForm((prev) => ({
    ...prev,
    [event.target.name]: event.target.value,
  }));
};
```

## onSubmit (<form onSubmit={onSubmit}>)

```js
const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

### - Property does not exist on type '{}' in TypeScript [Error ts(2345)]

> https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type

1. Type guard method

   ERROR --> const { bio, name, username }:User = originalUserInfo;

   CORRECT --> const { bio, name, username } = originalUserInfo as User;

### -How to setState with an object in Typescript? [Error ts(2345)]

> https://stackoverflow.com/questions/71791207/how-to-setstate-with-an-object-in-typescript-error-ts2345

CORRECT --> setProfileInfo((prev) => ({ ...prev, bio, name, username } as User));
