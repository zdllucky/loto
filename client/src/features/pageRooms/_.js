import Alpine from 'alpinejs';
Alpine.data('roomsList', () => ({
  rooms: [],
  isLoading: false,
  _refreshInterval: undefined,
  async init() {
    await this.refresh();
    this._refreshInterval = setInterval(() => this.refresh(), 5000);
  },
  destroy() {
    clearInterval(this._refreshInterval);
  },
  async refresh() {
    try {
      this.isLoading = true;
      this.rooms = (await Alpine.$repo.rooms.getRooms({ amount: 7 })).filter(({ botsCount }) => botsCount < 5);
    } catch (e) {
      this.rooms = [];
      alert(e.message ?? 'Something went wrong');
    } finally {
      this.isLoading = false;
    }
  },
}));

Alpine.data('selectRoom', () => ({
  isLoading: false,
  async selectRoom(roomId) {
    try {
      this.isLoading = true;
      await Alpine.$repo.rooms.selectRoom({ roomId });
      await Alpine.store('user').refresh();
      Alpine.$router.push('/room/await');
    } catch (e) {
      alert(e.message ?? 'Something went wrong');
    } finally {
      this.isLoading = false;
    }
  },
}));

Alpine.data('createRoom', () => ({
  password: '',
  type: false,
  speed: '2',
  isLoading: false,
  async createRoom() {
    try {
      this.isLoading = true;
      await Alpine.$repo.rooms.createRoom({
        password: this.password,
        type: this.type ? 'private' : 'public',
        speed: Number(this.speed),
      });
      await Alpine.store('user').refresh();
      Alpine.$router.push('/room/await');
    } catch (e) {
      alert(e.message ?? 'Something went wrong');
    } finally {
      this.isLoading = false;
    }
  },
}));

Alpine.data('joinPrivateRoom', () => ({
  password: '',
  isLoading: false,
  roomId: '',
  async join() {
    try {
      this.isLoading = true;
      await Alpine.$repo.rooms.joinPrivateRoom({
        roomId: this.roomId,
        password: this.password,
      });
      await Alpine.store('user').refresh();
      Alpine.$router.push('/room/await');
    } catch (e) {
      alert(e.message ?? 'Something went wrong');
    } finally {
      this.isLoading = false;
    }
  },
}));
