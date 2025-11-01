export default {
  category: 'stalk-game',
  name: 'List-Game',
  description: 'Show all available game stalker endpoints.',
  parameters: [],
  async execute() {
    return {
      creator: "Odzreshop",
      note: "Gunakan nama game dari daftar ini (ganti spasi dengan '-') sebagai path endpoint. Contoh: /api/stalk-game/8-ball-pool",
      games: [
        "8-ball-pool",
        "arena-of-valor",
        "auto-chess",
        "azur-lane",
        "call-of-duty",
        "dragon-city",
        "free-fire",
        "hago",
        "mobile-legends",
        "ml-region",
        "point-blank",
        "roblox"
      ]
    };
  }
};
