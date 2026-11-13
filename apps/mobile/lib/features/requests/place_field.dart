import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../../app/theme.dart';
import '../../core/api.dart';

/// Looks up addresses through the API (`/places/search`). Swappable in tests.
typedef PlaceSearch = Future<List<LocationDto>> Function(String query);

final placeSearchProvider = Provider<PlaceSearch>((ref) {
  final api = ref.watch(apiProvider);
  return (query) async {
    final res = await api.dio.get<List<dynamic>>(
      '/api/v1/places/search',
      queryParameters: {'q': query},
    );
    return [
      for (final p in res.data ?? const [])
        LocationDto(
          address: p['address'] as String,
          lat: (p['lat'] as num).toDouble(),
          lng: (p['lng'] as num).toDouble(),
        ),
    ];
  };
});

/// An address the user picks from search suggestions (or recent places), so every
/// pickup and drop is a real, located place. Typing alone is not accepted.
class PlaceField extends ConsumerStatefulWidget {
  const PlaceField({
    super.key,
    required this.label,
    required this.initial,
    required this.recent,
    required this.onChanged,
  });

  final String label;
  final LocationDto? initial;
  final List<LocationDto> recent;
  final ValueChanged<LocationDto?> onChanged;

  @override
  ConsumerState<PlaceField> createState() => _PlaceFieldState();
}

class _PlaceFieldState extends ConsumerState<PlaceField> {
  late final _address = TextEditingController(text: widget.initial?.address);
  late LocationDto? _selected = widget.initial;
  List<LocationDto> _suggestions = const [];
  Timer? _debounce;
  int _searchId = 0;
  bool _searching = false;
  bool _searched = false;
  String? _searchError;

  @override
  void dispose() {
    _debounce?.cancel();
    _address.dispose();
    super.dispose();
  }

  void _onTyped(String text) {
    if (_selected != null) widget.onChanged(null);
    _debounce?.cancel();
    setState(() {
      _selected = null;
      _searched = false;
      _searchError = null;
      if (text.trim().length < 3) _suggestions = const [];
    });
    if (text.trim().length >= 3) {
      _debounce = Timer(const Duration(milliseconds: 400), _search);
    }
  }

  Future<void> _search() async {
    final query = _address.text.trim();
    final id = ++_searchId;
    setState(() => _searching = true);
    try {
      final results = await ref.read(placeSearchProvider)(query);
      if (!mounted || id != _searchId) return;
      setState(() {
        _suggestions = results;
        _searched = true;
      });
    } catch (e) {
      if (!mounted || id != _searchId) return;
      setState(() {
        _suggestions = const [];
        _searchError = errorMessage(e);
      });
    } finally {
      if (mounted && id == _searchId) setState(() => _searching = false);
    }
  }

  void _pick(LocationDto place) {
    _debounce?.cancel();
    _searchId++;
    _address.text = place.address;
    FocusScope.of(context).unfocus();
    setState(() {
      _selected = place;
      _suggestions = const [];
      _searching = false;
      _searched = false;
      _searchError = null;
    });
    widget.onChanged(place);
  }

  String? get _errorText {
    if (_selected != null || _address.text.trim().isEmpty) return null;
    if (_searchError != null) return _searchError;
    if (_address.text.trim().length < 3) return 'Type at least 3 letters';
    if (_searched && _suggestions.isEmpty) {
      return 'No matching place. Try an area, road or landmark nearby.';
    }
    if (_searched) return 'Choose an address from the list';
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(widget.label, style: theme.textTheme.titleSmall),
        const SizedBox(height: 8),
        TextField(
          key: Key('place-${widget.label}'),
          controller: _address,
          textInputAction: TextInputAction.search,
          decoration: InputDecoration(
            labelText: '${widget.label} address',
            hintText: 'Search area, road or landmark',
            prefixIcon: const Icon(Icons.search),
            suffixIcon: _searching
                ? const Padding(
                    padding: EdgeInsets.all(14),
                    child: SizedBox.square(
                      dimension: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  )
                : _selected != null
                ? const Icon(Icons.check_circle, color: Brand.mintText)
                : null,
            errorText: _errorText,
            errorMaxLines: 2,
          ),
          onChanged: _onTyped,
          onSubmitted: (_) {
            if (_address.text.trim().length >= 3) _search();
          },
        ),
        if (_suggestions.isNotEmpty)
          Card(
            margin: const EdgeInsets.only(top: 4),
            child: Column(
              children: [
                for (final p in _suggestions)
                  ListTile(
                    dense: true,
                    leading: const Icon(Icons.place_outlined),
                    title: Text(p.address),
                    onTap: () => _pick(p),
                  ),
              ],
            ),
          ),
        if (widget.recent.isNotEmpty && _selected == null) ...[
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 4,
            children: [
              for (final p in widget.recent)
                ActionChip(
                  label: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 220),
                    child: Text(p.address, overflow: TextOverflow.ellipsis),
                  ),
                  avatar: const Icon(
                    Icons.history,
                    size: 16,
                    color: Brand.sand600,
                  ),
                  onPressed: () => _pick(p),
                ),
            ],
          ),
        ],
      ],
    );
  }
}
