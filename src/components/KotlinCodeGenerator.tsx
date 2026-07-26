import { FileCode, X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const TEMPLATES = [
  { id: 'viewmodel', name: 'ViewModel', code: `class UserViewModel : ViewModel() {\n    private val _state = MutableStateFlow(UserState())\n    val state = _state.asStateFlow()\n\n    fun loadUser(id: String) {\n        viewModelScope.launch {\n            _state.value = _state.value.copy(isLoading = true)\n            runCatching { repository.getUser(id) }\n                .onSuccess { _state.value = UserState(user = it) }\n                .onFailure { _state.value = _state.value.copy(error = it.message) }\n        }\n    }\n}` },
  { id: 'composable', name: 'Composable', code: `@Composable\nfun UserCard(user: User, onClick: () -> Unit) {\n    Card(\n        onClick = onClick,\n        modifier = Modifier.fillMaxWidth()\n    ) {\n        Column(modifier = Modifier.padding(16.dp)) {\n            Text(text = user.name, style = MaterialTheme.typography.titleMedium)\n            Text(text = user.email, style = MaterialTheme.typography.bodyMedium)\n        }\n    }\n}` },
  { id: 'repository', name: 'Repository', code: `class UserRepository @Inject constructor(\n    private val api: UserApi,\n    private val dao: UserDao,\n) {\n    fun getUsers(): Flow<List<User>> = dao.getAll()\n        .onStart { fetchFromNetwork() }\n\n    suspend fun fetchFromNetwork() {\n        runCatching { api.getUsers() }\n            .onSuccess { dao.insertAll(it) }\n    }\n}` },
  { id: 'usecase', name: 'UseCase', code: `class GetUserUseCase @Inject constructor(\n    private val repository: UserRepository,\n) {\n    operator fun invoke(id: String): Flow<User> =\n        repository.getUser(id)\n            .filterNotNull()\n            .distinctUntilChanged()\n}` },
];

export default function KotlinCodeGenerator({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const copy = () => { navigator.clipboard?.writeText(TEMPLATES[selected].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><FileCode className="w-5 h-5 text-orange-400" /><h3 className="text-sm font-semibold text-slate-100">Kotlin Code Generator</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-40 border-r border-slate-800 py-2 shrink-0">
            {TEMPLATES.map((t, i) => <button key={t.id} onClick={() => setSelected(i)} className={`w-full text-left px-3 py-2 text-xs transition-colors ${i === selected ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>{t.name}</button>)}
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-slate-500">{TEMPLATES[selected].name}.kt</span><button onClick={copy} className="text-xs px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center gap-1">{copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} {copied ? 'Copied' : 'Copy'}</button></div>
            <pre className="text-xs font-mono text-slate-300 bg-slate-950/50 rounded-lg p-3 overflow-auto"><code>{TEMPLATES[selected].code}</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
}
