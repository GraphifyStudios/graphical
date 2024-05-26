async function main() {
  const dbFile = Bun.file("./db.json");
  const db = await dbFile.json();

  for(const user of db.users) {
    if(!user.avatar) {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?id=${user.id}&part=snippet&key=AIzaSyCKeAtxUossyZ85M9OTOc3eomkDZhu6HeM`);
      const data = await res.json();
      user.avatar = data.items[0].snippet.thumbnails.high?.url ?? data.items[0].snippet.thumbnails.medium?.url ?? data.items[0].snippet.thumbnails.default?.url;
    }
  }

  await Bun.write("./db.json", JSON.stringify(db));
}

main()
