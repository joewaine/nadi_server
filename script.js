let betterArray = [];

let retail = [
  {
    id: "26f108c0-6540-4b8b-9bed-7623e80eccc7",
    name: "Spices",
    timing_mask: null,
    item_ids: [
      "7fefad67-c1f5-4346-ab9b-f9c5d9586476",
      "81a5b17b-bb15-40a9-a059-75be5f6794a8",
    ],
  },
  {
    id: "eff63508-09a3-40fd-a9a4-2ed29b887cbb",
    name: "Retail",
    timing_mask: null,
    item_ids: [
      "92bf2351-e8f0-4fd6-a468-2e05c7966930",
      "665db5b9-10cf-48d6-9d34-3fcfa788a576",
      "8d6725f0-5fc2-4b89-8da5-a8f929043eac",
      "2badef86-1dca-46a5-91d4-72c1d6750512",
      "fff57ff7-824b-4867-8116-efdac2a9b9b5",
      "3512fc2b-a0a8-445a-ae3e-5d86ff966c6c",
      "8bd95f5c-ce6e-4717-b77d-2967650aa323",
      "6675034d-df80-4ad9-a19a-9d0c1e82d778",
      "a3c1fbaa-468d-40bf-bb36-2df2f58c5966",
      "31b2d948-0a30-4c1f-9335-0e4e5bccad4d",
      "a359e96d-8402-4d21-afe1-c75e07290ad3",
    ],
  },
];

retail.forEach(function (x) {
  betterArray.push(
    x.item_ids.map(function (y) {
      return {
        category: x.name,
        id: y,
      };
    })
  );
});

console.log(betterArray.flat());
