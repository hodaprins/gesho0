import { FileCode2, X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const TEMPLATES = [
  { id: 'view', name: 'View', code: `struct UserProfileView: View {\n    @StateObject var viewModel = UserViewModel()\n\n    var body: some View {\n        NavigationStack {\n            List(viewModel.users) { user in\n                NavigationLink(user.name) {\n                    UserDetailView(user: user)\n                }\n            }\n            .navigationTitle("Users")\n        }\n    }\n}` },
  { id: 'viewmodel', name: 'ViewModel', code: `@MainActor\nclass UserViewModel: ObservableObject {\n    @Published var users: [User] = []\n    @Published var isLoading = false\n\n    private let service: UserService\n\n    init(service: UserService = .shared) {\n        self.service = service\n    }\n\n    func loadUsers() async {\n        isLoading = true\n        defer { isLoading = false }\n        users = (try? await service.fetchUsers()) ?? []\n    }\n}` },
  { id: 'model', name: 'Model', code: `struct User: Identifiable, Codable, Hashable {\n    let id: UUID\n    var name: String\n    var email: String\n    var avatarURL: URL?\n\n    enum CodingKeys: String, CodingKey {\n        case id, name, email\n        case avatarURL = "avatar_url"\n    }\n}` },
  { id: 'service', name: 'Service', code: `actor UserService {\n    static let shared = UserService()\n\n    private let client = APIClient()\n\n    func fetchUsers() async throws -> [User] {\n        try await client.get("/users")\n    }\n\n    func updateUser(_ user: User) async throws -> User {\n        try await client.put("/users/\\(user.id)", body: user)\n    }\n}` },
];

export default function SwiftCodeGenerator({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  if (!open) return null;
  const copy = () => { navigator.clipboard?.writeText(TEMPLATES[selected].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><FileCode2 className="w-5 h-5 text-orange-400" /><h3 className="text-sm font-semibold text-slate-100">Swift Code Generator</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-40 border-r border-slate-800 py-2 shrink-0">
            {TEMPLATES.map((t, i) => <button key={t.id} onClick={() => setSelected(i)} className={`w-full text-left px-3 py-2 text-xs transition-colors ${i === selected ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>{t.name}</button>)}
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-slate-500">{TEMPLATES[selected].name}.swift</span><button onClick={copy} className="text-xs px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center gap-1">{copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} {copied ? 'Copied' : 'Copy'}</button></div>
            <pre className="text-xs font-mono text-slate-300 bg-slate-950/50 rounded-lg p-3 overflow-auto"><code>{TEMPLATES[selected].code}</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
}
